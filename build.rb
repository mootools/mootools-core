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

module MooTools
  class Build
    
    attr_reader :included
    attr_accessor :build_path
    attr_accessor :dependency_path
    
    def initialize(path = File.dirname(__FILE__))
      @path = path
      @scripts = []
      @included = []
      @data = {}
      
      @build_path      ||= @path + '/mootools.js'
      @dependency_path ||= @path + '/Source/scripts.json'
      
      json = JSON.load(File.read( dependency_path ))
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
      return if @included.index(name) || name == 'None';
      unless @data.key? name
        puts "Script '#{name}' not found!"
        throw :script_not_found
      end
      @included.push name
      @data[name][:deps].each { |dep| load_script dep }
      @string ||= ""
      @string << File.read(@path + "/Source/#{@data[name][:folder]}/#{name}.js") << "\n"
    end
    
    def build
      @string ||= full_build
      @string.sub!('%build%', build_number)
    end
    alias :to_s :build
    
    def build_number
      ref =  File.read(File.dirname(__FILE__) + '/.git/HEAD').chomp.match(/ref: (.*)/)[1]
      return File.read(File.dirname(__FILE__) + "/.git/#{ref}").chomp
    end
    
    def save(filename)
      File.open(filename, 'w') { |fh| fh.write to_s }
    end
    
    def save!
      save build_path
    end
    
    def self.build!(argv)
      mootools = MooTools::Build.new
      
      catch :script_not_found do
        if argv.length > 0
          argv.each { |script| mootools.load_script(script) }
        else
          mootools.full_build
        end
      end
      
      puts "MooTools Built '#{mootools.build_path}'"
      print "  Included Scripts:","\n    "
      puts mootools.included.join(" ")
      mootools.save!
      
    end
    
  end
end
if __FILE__ == $0
  
  MooTools::Build.build! ARGV
  
end
