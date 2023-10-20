
If you don't have Permissions to install npm on school macs, you need to change the default path where npm will put all its data

- Change npm's default directory:```
	mkdir ~/.npm-global
	npm config set prefix '~/.npm-global'
	export PATH=~/.npm-global/bin:$PATH```
- to apply changes run: ```
	 source ~/.zshrc```
	 
Npm data is now stored in:   */Users/mmensing/.npm/*

