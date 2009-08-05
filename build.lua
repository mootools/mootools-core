#!/usr/bin/env lua

--[[

INSTRUCTIONS
============
 
Full Build
----------

	./build.lua

Partial Build (includes dependancies)
-------------------------------------

	./build.lua Fx.Tween DomReady
	
	
Requires
--------

This script requires yaml for lua. http://luayaml.luaforge.net/
To successfully compile luaYAML in OSX you'll have to open Makefile and replace
"-shared" with "-bundle -undefined dynamic_lookup -all_load"
luaYaml requires Syck 0.55, which compiles just fine in Mac OSX Leopard: http://whytheluckystiff.net/syck/


--]]

require "yaml"

-- table.contains ()
-- tests if an item is included in a table

function table:contains(item)

	for key, value in ipairs(self) do
		if value == item then
			return true
		end
	end
	
	return false;

end

-- table.include ()
-- includes an item in a table if not already present

function table:include(item)

	if not table.contains(self, item) then table.insert(self, item) end

	return self

end

-- build ()

local function build(selected_scripts)

	local package = yaml.load_file("package.yml") -- reads the configuration from package.yml

	local output_path = package.filename
	
	local data = {}
	local all_scripts = {}
	
	for i, path in ipairs(package.files) do
	
		local script = io.open(path):read("*all")
	
		if i == 1 then -- fills %build% in the first file if it's called from a git clone
		
			local ref = io.open('.git/HEAD')
			if ref then
				ref = ref:read("*all"):match("ref: ([%w/]+)")
				ref = io.open('.git/' .. ref):read("*all"):match("(%w+)")
				script = script:gsub("%%build%%", ref)
			end
		
		end

		local descriptor = yaml.load(script:match("/[*]=(.*)=[*]/"))

		table.insert(all_scripts, descriptor.name)
		
		data[descriptor.name] = {
			source = script,
			path = path,
			requires = (type(descriptor.requires) == 'table') and descriptor.requires or {descriptor.requires}
		}

	end
	
	local included_scripts = {}
	
	local scripts = table.maxn(selected_scripts) ~= 0 and selected_scripts or all_scripts
	
	function rock_requires(name)
		for i, n in ipairs(data[name].requires) do
			rock_requires(n);
		end
		
		table.include(included_scripts, name)
	end
	
	for i, name in ipairs(scripts) do
		rock_requires(name)
	end
	
	local sources = {}
	
	local mootools = io.open(output_path, "w+")
	
	io.write("\nBuilding " .. output_path .. "\n\nIncluded Scripts:\n\n")

	for i, name in ipairs(included_scripts) do
		table.insert(sources, data[name].source)
		io.write('\t ' .. name .. '\n');
	end
	
	io.write('\n')
	
	mootools:write(table.concat(sources, '\n\n'))

end

build(arg)
