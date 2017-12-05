
# require "kramdown"
require 'rdiscount'
require "nokogiri"

module Jekyll
  module RdiscountFilter
    def rdiscount(input)
      # site = @context.registers[:site]
      # converter =
      # if site.respond_to?(:find_converter_instance)
      #   site.find_converter_instance(Jekyll::Converters::Markdown)
      # else
      #   site.getConverterImpl(Jekyll::Converters::Markdown)
      # end
      doc = Nokogiri::HTML(input)
      doc.css('.content').each do |node|
        # puts node.inner_text
        #new_node = doc.create_element "div", :class => "content"
        # inner_html = converter.convert(node.inner_text.to_s)
        inner_html = RDiscount.new(node.inner_text.to_s).to_html
        #Kramdown::Document.new(node.inner_text.to_s, site.config['kramdown']).to_html
        node.inner_html = inner_html
      end
      doc.to_html
    end
  end
end

Liquid::Template.register_filter(Jekyll::RdiscountFilter)