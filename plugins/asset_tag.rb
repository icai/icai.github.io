require "sprockets"
require "sprockets-sass"
require "sprockets-helpers"
require "octopress-hooks"
require "fileutils"
require "compass"
require "bootstrap-sass"
require "font-awesome-sass"

module Jekyll
  class Site
    attr_accessor :sprockets
  end
end


def sprocketsHooks(site)
  assets_prefix = "source/_assets"
  docs_path     = File.expand_path('..', File.dirname(__FILE__))
  manifest_path = ".assets-cache/manifest.json"
  # Get relevant paths
  project_root = docs_path
  # Initialize Sprockets
  environment = Sprockets::Environment.new
  # import variable
  site.sprockets = environment 
  Dir[Pathname.new(project_root).join(assets_prefix, '*/')].each do |path|
    environment.append_path(path)
  end

  # Set configuration
  environment.js_compressor  = :uglifier
  environment.css_compressor = :sass

  Sprockets::Helpers.configure do |config|
    config.environment = environment
    config.prefix = "/assets"
    config.public_path = "public"
    config.digest = true
    config.protocol = :relative
  end
  assets_compile =  %w(*.eot *.svg *.ttf *.woff *.woff2 *.jpg *.png application.js application.css slide.css)
  manifest = Sprockets::Manifest.new(environment, manifest_path)
  manifest.compile assets_compile
end

def copyAssetsToTarget(site)
  FileUtils.cp_r(".assets-cache/.", "public/assets")
  FileUtils.rm_rf [Dir.glob(".assets-cache/**")]
end

if defined?(Jekyll::Hooks)
  Jekyll::Hooks.register :site, :pre_render, priority: :low do |site|
    sprocketsHooks(site)
  end
  Jekyll::Hooks.register :site, :post_write, priority: :low do |site|
    copyAssetsToTarget(site)
  end
else
  require 'octopress-hooks'
  class SiteHooks < Octopress::Hooks::Site
    priority :low
    def pre_render(site)
      sprocketsHooks(site)
    end
    def post_write(site)
      copyAssetsToTarget(site)
    end
  end
end


module Jekyll
    class AssetsTag < Liquid::Tag
      # require_relative "tag/proxied_asset"
      # require_relative "tag/parser"
      # attr_reader :args

      def initialize(tag_name, markup, tokens)
        @tag = tag_name
        @path = markup.to_s.strip
        @tokens = tokens
        # @tag = from_alias(tag)
        # @args = Parser.new(args, @tag)
        @og_tag = tag_name
        super
      end

      def render(context)
        site = context.registers[:site]
        sprockets = Sprockets::Context.new(site.sprockets, '', Pathname.new(''))
        sprockets.method(@tag).call(@path)

      end
    end
end

%W(asset_path path_to_asset asset_tag audio_path path_to_audio font_path path_to_font image_path path_to_image javascript_path path_to_javascript javascript_tag stylesheet_path path_to_stylesheet stylesheet_tag video_path path_to_video).each do |t|
  Liquid::Template.register_tag(t, Jekyll::AssetsTag)
end