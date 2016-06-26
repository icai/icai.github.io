# This plugin still has some bugs.
# Don't have any config in config in _config.yml
# Author: https://github.com/icai

require "sprockets"
require "sprockets-sass"
require "sprockets-helpers"
require "fileutils"
require "compass"
require "bootstrap-sass"
require "font-awesome-sass"

module Jekyll
  class Site
    attr_accessor :sprocketsEnv
  end
end


def sprocketsHooks(site)
  assets_prefix = "source/assets"
  docs_path     = File.expand_path('..', File.dirname(__FILE__))

  manifest_path = ".assets-cache/manifest.json"
  # Get relevant paths
  project_root = docs_path
  # Initialize Sprockets
  environment = Sprockets::Environment.new(docs_path)
  # import variable
  site.sprocketsEnv = environment

  Dir[Pathname.new(project_root).join(assets_prefix, '*/')].each do |path|
    environment.append_path(path)
  end
  # Set configuration
  environment.js_compressor  = :uglifier
  environment.css_compressor = :sass
  
  assets_compile =  %w(*.eot *.svg *.ttf *.woff *.woff2 *.jpg *.gif *.png application.js application.css slide.css)

  Sprockets::Helpers.configure do |config|
    config.environment = environment
    config.prefix = "/assets"
    config.public_path = "public"
    config.digest = true
    config.protocol = :relative
    # config.expand = true
    # config.manifest = false
    # config.debug = true
  end
  manifest = Sprockets::Manifest.new(environment, manifest_path)
  manifest.compile assets_compile

end

def copyAssetsToTarget(site)
  FileUtils.cp_r(".assets-cache/.", "public/assets")
  FileUtils.rm_rf [Dir.glob(".assets-cache/**")]
end

# , priority: :low

Jekyll::Hooks.register :site, :pre_render do |site|
  sprocketsHooks(site)
end
Jekyll::Hooks.register :site, :post_write do |site|
  copyAssetsToTarget(site)
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
        sprockets = Sprockets::Context.new(site.sprocketsEnv, '', Pathname.new(''))
        sprockets.method(@tag).call(@path)

      end
    end
end

%W(asset_path path_to_asset asset_tag audio_path path_to_audio font_path path_to_font image_path path_to_image javascript_path path_to_javascript javascript_tag stylesheet_path path_to_stylesheet stylesheet_tag video_path path_to_video).each do |t|
  Liquid::Template.register_tag(t, Jekyll::AssetsTag)
end