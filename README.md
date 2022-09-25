# education-platform-for-quantum-cryptography [![Build on GitHub](https://github.com/BaderTim/education-platform-for-quantum-cryptography/actions/workflows/publish.yml/badge.svg?branch=main)](https://github.com/BaderTim/education-platform-for-quantum-cryptography/actions/workflows/publish.yml)
This web application is the result of our (group of 3) study work project at DHBW Ravensburg in 2022. 

> https://badertim.github.io/education-platform-for-quantum-cryptography 

## About the project

Our initial goal was to create a tool that primary helps bachelor students to get a better understanding about quantum cryptography.   

After doing a requirements analysis we came to the conclusion that the software had to have a lot of visual appealing and interactive elements. Since the software is supposed to be introduced to students by their professors, they should be able to configure the content as neccessary for their own individual teaching intentions.   

This is why the website's content can be modified by making use of the file structure inside the `public` folder. Each page is represented by a _LaTeX_ file which makes use of the basic syntax in addition to custom LaTeX Elements.


## Repository
- `/.github/workflows`: GitHub workflows (e.g. for deploying on GitHub Pages)
- `/project`: other project related files besides the source code (e.g. presentations)
- `/webapp`: web application source code
- `README.md`: the file you are currently reading

## Branches
- **main**: production-ready dev build (```builds app and publishes it to 'prod' after each change```) 
- **prod**: hosts compiled production webapp
