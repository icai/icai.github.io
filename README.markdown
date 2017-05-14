## A blog using Jekyll 3


### Theme

Current theme based on [Shashank Mehta](https://shashankmehta.in/archive/2012/greyshade.html). 


### Plugins

```
	plugins
	├── assets_hooks.rb
	├── backtick_code_block.rb
	├── blockquote.rb
	├── category_generator.rb
	├── category_list_tag.rb
	├── code_block.rb
	├── config_tag.rb
	├── haml.rb
	├── include_array.rb
	├── include_code.rb
	├── jsfiddle.rb
	├── octopress_filters.rb
	├── pullquote.rb
	├── pygments_code.rb
	├── raw.rb
	├── render_partial.rb
	├── rubypants.rb
	├── slides.rb
	├── tag_cloud.rb
	├── tag_generator.rb
	├── titlecase.rb
	└── video_tag.rb

	0 directories, 22 files

  gem 'jekyll-sitemap'
  gem 'jekyll-paginate'
  gem 'jekyll-gist'



```


### Style and Assets

```

  gem 'jekyll-assets'
  gem 'bootstrap-sass', '~> 3.3.5'
  gem 'font-awesome-sass', '~> 4.6.2'
  gem 'mini_magick'
  gem 'autoprefixer-rails'
  gem 'uglifier'
  gem 'sass'


```


### Task

Octopress 2 Rakefile

```
	rake clean                     # Clean out caches: .pygments-cache, .gist-c...
	rake copydot[source,dest]      # copy dot files for deployment
	rake deploy                    # Default deploy task
	rake gen_deploy                # Generate website and deploy
	rake generate                  # Generate jekyll site
	rake install[theme]            # Initial setup for Octopress: copies the de...
	rake integrate                 # Move all stashed posts back into the posts...
	rake isolate[filename]         # Move all other posts than the one currentl...
	rake list                      # list tasks
	rake new_page[filename]        # Create a new page in source/(filename)/ind...
	rake new_post[title]           # Begin a new post in source/_posts
	rake preview                   # preview the site in a web browser
	rake push                      # deploy public directory to github pages
	rake rsync                     # Deploy website via rsync
	rake set_root_dir[dir]         # Update configurations to support publishin...
	rake setup_github_pages[repo]  # Set up _deploy folder and deploy branch fo...
	rake update_source[theme]      # Move source to source.old, install source ...
	rake update_style[theme]       # Move sass to sass.old, install sass theme ...
	rake watch                     # Watch the site and regenerate when it changes

```




