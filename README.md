# 75 Hard Docs

## Features
* Users can log their current 75-hard challenge, reflect on previous ones
* Users should be able to map out a 75-day long streak on a display
* Users should be able to upload their image everyday, and indicate completion of the tenants of the 75-hard challenge.
* Log workouts, calories burned, books read, etc.
* Could add comments/journal entry about the day, mindfulness component? 

### Challenge Data

Is an array of days: 1... 75
Each day consists of:
<ul>
    <li>water</li>
    <li>exercised</li>
    <li>diet</li>
    <li>learn</li>
    <li>cheated</li>
    <li>bodyPic</li>
</ul>

## Long-Term Features
* Get metrics on their performance
* Share via email/social media platforms their progress/goals


## Things to do immediately:
* Rewrite pg_adapter query functionality
    just use regular functions instead of trying to abstract it all.
    - add a test page to the UI
* Finish backend processing of data
    Finish user account CRUD operations
* UI MVP functionality

## Long-Term Software Goals:
* Style the web pages
* Add unit tests to back-end
## Long-Term Infrastructure Goals:
* Deploy to cloud
* Create iOS App