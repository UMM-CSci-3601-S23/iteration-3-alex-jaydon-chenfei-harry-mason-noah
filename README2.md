### Pocketshelf 3.0
Pocketshelf 3.0 is our tool to help clients, donors, and volunteers of the stevens county food shelf communicate with each other in a more modern way than paper request forms. 

**For clients**, We created a digitalized food request form that automatically checks if your required fields are completed, as well as removes unnecessary barriers of entry, such as figuring out what yearly income a family of your size has to be under to be eligible to submit a form. 

**For Donors**, We created a page where items that the food shelf is currently running out of is displayed, as well as how much is needed. Donors can also search for specific items to see if something that they would like to donate is needed at that time. Finally, Donors can pledge to bring in food with our pledge system by deciding what they would like to donate and when they will bring it in. 

**For Volunteers**, We created many tools to streamline the fulfillment of requests as well as management of pledges:

• A view to see all lice requests, as well as vital information in them, such as the name of the client, what they have requested, when it was requested, and more. 

• The ability to archive requests so that they no longer show up on / clutter  the initial volunteer page, but can be referenced at a later to date. 

• The ability to quickly delete requests with the press of a button, in case the system is victim to trolling or otherwise.

• The ability to edit certain fields of a request, like name or description in case a mistake was made in them.

• In the edit request page, the ability to mark items of the request as complete (in stock/ready) or post them to the donor view so that it can get pledged.

• A view to see all current pledges as well as their relevant information, such as what's being donated, how much, and when it will be delivered. 

Finally, we made an entry level authentication system to hide all the important and personal information that naturally could be gleamed off of seeing volunteer view, as well as making things like deleting posted items off of donor view only able to be done by Volunteers after becoming authenticated.


### Tools and Technologies we used 

For our frontend we used Angular, a TypeScript-based, free and open-source web application framework. The languages used in it are HTML, CSS, and Typescript. 

For our backend, we used Javalin, a light web framework that acts more as a library for Kotlin and Java than a framework. Our backend is coded exclusively in Java.


That probably includes describing what tools, languages, and technologies the project uses. 

### Known Issues
• The post button in edit-request redirects back to volunteer view for some reason.

• Pledges are not processed properly and error out if not authenticated.

• edit-request always says "This person's income is above the guidelines" regardless of the value of incomeValid

### Todo
• We would like to make a "pledge not received" button of some sorts in the case that a pledge was made but not brought in. This button would automatically delete the pledge as well as adding back whatever was pledged to be brought in back to the donor view.

• We would like there to be some consistency in the way donor view is presented, right now there is no sorting on the items. We would like to make a sorting mechanism that displays the item with the highest number of requests at the top, and the item with the least number of requests at the bottom. 

### Pocketshelf 3.0 Pamphlet
![Here](https://docs.google.com/document/d/1DFmI10Fb9Pu0v2_xI7IsvGs1NzDBrSC96Yj3u9hOwNw/edit?usp=drivesdk) is a link to a pamphlet with relevant information about Pocketshelf 3.0.

### Try Pocketshelf 3.0 for yourself!
![Here](https://docs.google.com/document/d/13HHazWTxdvMwt1FRh3CoDaKdxpRUhnFa6t99sgd8bMU/edit#heading=h.bllyran0q013) is a link with a tutorial of how to set up and deploy our repository.

