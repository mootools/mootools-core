#!/usr/bin/env lua

--[[

# USAGE:
 
Full Build
----------

./build.lua

Partial Build (includes dependancies)
-------------------------------------

./build.lua Fx.Tween DomReady

--]]

require "luarocks.require"
require "json"

-- table.include ()
-- includes a value in a table if not already present

function table:include(included)

	local present = false

	for key, value in ipairs(self) do
		if value == included then
			present = true
			break
		end
	end

	if not present then table.insert(self, included) end

	return self

end

-- Build ()
-- builds MooTools

local function Build(selected)

	json_path = "Source/scripts.json"
	scripts_path = "Source/"
	output_path = "mootools.js"

	-- scripts {}
	-- the json structure as a table
	
	scripts = {}
	
	-- all {}
	-- a list of every script
	
	all = {}

	for folder, files in pairs(json.decode(io.open(json_path):read("*all"))) do
	
		scripts[folder] = {}
		
		local folder = scripts[folder]
	
		for script, props in pairs(files) do
			folder[script] = props.deps
			table.insert(all, script)
		end
	end

	-- folder_of ()
	-- returns the folder name from a script

	function folder_of(name)

		for folder, files in pairs(scripts) do
			for file in pairs(files) do
				if file == name then return folder end
			end
		end

	end

	-- deps_of ()
	-- returns a table containing the full dependancies of a file

	function deps_of(name)

		local list = {}
		
		if name == "Core" then return list end
		
		local deps = scripts[folder_of(name)][name];
	
		for i, script in ipairs(deps) do
			for j, scr in ipairs(deps_of(script)) do table.include(list, scr) end
			table.include(list, script)
		end
	
		return list

	end

	-- build ()
	-- builds from a list of scripts

	function build(scripts)

		local list = {}
	
		for i, name in ipairs(scripts) do
			for i, dep in ipairs(deps_of(name)) do table.include(list, dep) end
			table.include(list, name)
		end
		
		-- write mootools
		
		io.write("\nMooTools Built as " .. output_path .. "\n\n")
		io.write("Included Scripts: ")
	
		local mootools = io.open(output_path, "w+")

		for i, file in ipairs(list) do
			io.write(file .. ".js")
			local str = io.open(scripts_path .. folder_of(file) .. "/" .. file .. ".js"):read("*all")
			
			-- %build% replace
			
			if file == "Core" then

				local ref = io.open('.git/HEAD'):read("*all"):match("ref: ([%w/]+)")
				ref = io.open('.git/' .. ref):read("*all"):match("(%w+)")
				str = str:gsub("%%build%%", ref)

			end

			mootools:write(str)
			if i ~= table.maxn(list) then
				mootools:write("\n")
				io.write(", ")
			end
		end
		
		io.write("\n\n")

	end
	
	-- checks arg
	
	if table.maxn(selected) == 0 then build(all) else build(selected) end

end

-- builds mootools

Build(arg)
