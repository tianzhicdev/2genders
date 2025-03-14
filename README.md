# 2genders

## Overview

2genders is a web application that allows users to submit their profiles through a survey form. The application consists of a React frontend and a Flask backend connected to a PostgreSQL database.


stage 1: be able to submit the survey form and save the data to the database.
stage 2: be able to match users and list the matched users.

todo:
1. frontend:
    stage 1:
    - [v] submit user email at the end. (we will let the user to use the email to login or create an account. we do not require registering after the survey.)
    - [v] make the questions page good looking and work well on mobile.
    - [v] landing page
    - [v] user events
    - [v] 2genders.vip redirect verification.
    - [ ] snapchat ads
    - [ ] twitter ads
    stage 2:
        match users (1):
    - [ ] list of matched users, 
    - [ ] be able to share contacts.

    - [ ] generate 30 vibe questions.
    - [ ] show 2 pics to get the vibe.
2. backend:
    stage 1:
    - [v] save the survey data to the database.
    stage 2:
        match users (1):
        - [ ] match table, a,b,a_data,b_data {a_data: {social_shared: true}}
        - [ ] ai job to find matched users
        - [ ] [infra] auto refresh certbot for https
        authentication (1):
            google login:
            [v] create account: email,password,password_confirm
            [v] login: email,password
        metrics(2):
        - [ ] metrics: the time it takes to answer each question.
        - [ ] male, female ratio
        
    3. marketing:
        stage 2 (2):
        - [ ] more users channels - x.com
            - [ ] different questions for different channels