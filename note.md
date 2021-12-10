<!-- How password reset work -->
### 1. How password reset work
- user enter the email
- you will find that user base on email from db
- if found, you will create a password reset, then save it into db and also send to that user's email
- if this is the correct user, he will access to his email, he can copy that code and paste in the form, enter new password then hit submit
- on submit, our sever will recieve the user's email and code
- if found, update his old password with new one and reset code back to empty
- done

### 2. Set up stripe payment
- use tripe connect (check supported countries)
- recieve payment from users
- automate the payment distribution
- 70% to sellers (instructors) and keep 30% as platform fee 
- get paid every 48 hours directly to bank account  by stripe 


### server host
https://henrynd.herokuapp.com

###aws
arn:aws:iam::787129752368:user/henry
  