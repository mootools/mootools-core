#!/usr/bin/env ruby

# USAGE:
# 
# Full:
# ./build.rb
# 
# Fx.Tween, DomReady including all dependencies:
# ./build.rb Fx.Tween DomReady

require 'rubygems'
require 'json'

class MooTools
  
  attr_reader :included
  
  def initialize
    @scripts = []
    @included = []
    @string = ""
    @data = {};
    json = JSON.load(File.read('./Source/scripts.json'))
    json.each_pair do |folder, group|
      group.each_pair do |script, properties|
        @data[script] = {:folder => folder, :deps => properties["deps"]}
      end
    end
  end
  
  def full_build
    @data.each_key { |name| load_script name }
    @string
  end
  
  def load_script(name)
    return if @included.index(name);
    unless @data.key? name
      puts "Script '#{name}' not found!"
      throw :script_not_found
    end
    @included.push name
    @data[name][:deps].each { |dep| load_script dep }
    @string << File.read("./Source/#{@data[name][:folder]}/#{name}.js") << "\n"
  end
  
  def save(filename)
    File.open(filename, 'w') { |fh| fh.write @string }
  end
  
end

if __FILE__ == $0
  
  mootools = MooTools.new
  
  catch :script_not_found do
    if ARGV.length > 0
      ARGV.each { |script| mootools.load_script(script) }
    else
      mootools.full_build
    end
  end
  
  puts "Included:"
  puts mootools.included.join(' ')
  mootools.save('mootools.js')
  
end
