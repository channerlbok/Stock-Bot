## 11-10-2026

    I made the frontend branch and added the ./frontend directory.I updated the gitignore to exclude the node_modules directory and then copied the contents of the HW3 exercise directory as an initial commit.  I also made the ./documentation directory and this journal file within.
    about 30 minutes

## 11-11-2026

    Updated the frontend branch with some basic updates regarding layout and simple refactoring to better reflect our desired end product. I refactored all the ```.js``` files into ```.ts``` and ```.tsx``` files and had to play around with the package.json versions for a while until I could get a successful ```npm install``.  Notably, I had to reduce the TypeScript version from ^7.0.2 to ^4 for it to be compatible with the react-scripts version.  I also had to add a lot of elements to the tsconfig.json in order to get the project to compile and ```npm start``` correctly.
    about 60 minutes

## 11-12-26

    Started adding some of the flavor text to the home page and fleshed out the user login page with a form.  Updated the log in link witha blank user picture.  Tried to play with the CSS file a bit to right justify the user long in link, but realized it was not being currently applied.  I will look into that later.
    about 60 minutes

## 11-16-26

    Did a pull request review for Jack's Branch.  Concerned that fetching it and pulling it to my current working project might have poisoned my local branch.  I guess I better get his pull request merged and then get mine merged ASAP so that I can bring my branch into sync with main.  implemented the CSS file by renaming it to main.module.css and importing it into the app and applying it on the correct element.  Might be a good Idea to make a nav.module.css and take all the inline css out of those elements and re-implement them there.  Also added a very basic readme.md with install and run instructions.  Created a UserData data type and made it a state varaible that can be passed around.  updated the Login link to show the user name if it is not ''.  Need to update the Login Page to set the userName and make a very basic "data" or "stocks" page that is only visible when the userName is not ''.  That is probably going to happen Wednesday.
    about 60 minutes

## 11-17-26

    Worked on passing the userState between the login page, the app, the account page and the stock page.  I may have made more problems than I fixed.  I am taking a break in order to have a snack and clear my head.
    about 60 minutes.
    I came back to this after dinner and managed to get the app to render, and navigate to, the Login page.  However, it appears that the userState does not get passed back correctly.  I think this is because the actual link that gets called is "/" in useNavigate which leads to index.tsx, not directly to app.tsx.  Which means I either need to implement another layer of State Passing, turn this into a Context, or rewrite this to not pass to individual links, but instead render all inside one app.  I am thinking rendering inside one app is the right way to go since it would be more secure and prevent direct access to elemnts of the applications from outside.  REgardless, this is demoralizing to find out one day before I am supposed to make a PR for the other teammates to review and then merge.  I am going to step away and let my mind clear again before making a final decision.  Maybe I will post this question to the groups as well.
    about 45 minutes.
