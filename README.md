# VSCode multiple-find-replace

## This extension is huge inspired by [pgilfernandez/multiple-find-replace](https://github.com/pgilfernandez/multiple-find-replace), Thank you!!

This is Multiple Find Replace extension for VSCode.  

This extension can do almost same things that inspired extension.

## Options

- Split syntax can be customized from plugin settings.
- This extension works both of only in selection and overall of a document.
- Find whole word or strings.
- It can disable substitute notification.  

## Usage

1) The first time it is launched it will create a template file where the *FIND* and *REPLACE* statements should be placed.(You can open template with "Open template" command)

2) Use the splitter sintax (by default it is ' => ') to split the *FIND* and *REPLACE* statements, the FIND one goes on the left and the *REPLACE* one on the right (The Last line of template file must be end with newline):

> Find and replace me => Replaced!
  


3) Each line will represent a *FIND* and *REPLACE* command, use as many lines as you wish in your template file

4) Save the template file

5) Launch the "Multiple Replace" command by menus or contextual menu.
