
![taller (1)](https://github.com/user-attachments/assets/8edc277d-8c09-4d0f-9d08-cde6699d7f89) ![taller](https://github.com/user-attachments/assets/7e65fd63-b429-4995-8ab6-8b5d5e6dbb9d)

# ClassKick Challenge

[![forthebadge](https://forthebadge.com/images/badges/made-with-next-13.svg)](http://forthebadge.com)
[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)
[![Vercel](https://vercelbadge.vercel.app/api/ser0125/qventus-take-home-app?style=for-the-badge)](https://qventus-take-home-hq5a273ej-ser0125.vercel.app/)


Next JS application, responsible for monitor the Factory Four Apis

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Demo](#demo)
- [Contributing](#contributing)
- [License](#license)
- [Contact Information](#contact-information)

## Installation

1. Clone the repository:

```shell
$ git clone https://github.com/ser0125/frontend-take-home-project.git
```

2. Move to the folder project

```shell
$ cd frontend-take-home-project
```

3. Install the dependencies

```shell
$ npm install
```

## Usage

To run the application, use the command:

```shell
$ npm run dev
```

If you open the browser in the port indicated by Next usually the 3000, you should see the Dashboard or Home page:

![home page](https://github.com/user-attachments/assets/fe039888-9e92-4e3e-8e4d-64a51c34570e)


### How it works

The main component would be `<CanvasDrawer />` on the `app/page.tsx`  

![image](https://github.com/user-attachments/assets/4f8e49b1-a18b-4e6a-a8ba-8aa4c819efb3)


The CanvasDrawer is using a custom hook `useCanvas()` to handle the logic and has html to control the buttons and the canvas element 

![image](https://github.com/user-attachments/assets/65df00fb-2fe7-414c-ba18-5dd12cc15a6c)


Inside the `useCanvas` hook there is a part of the store and some functions to drawText, draw, clear and more.

![image](https://github.com/user-attachments/assets/1fa3315c-5be6-4eb0-86e7-e00107ad1aab)


Zustand is being used as state management tool

![image](https://github.com/user-attachments/assets/aa1d6ea0-cfec-43cc-92bc-a5dd47ecaaf9)


---


## Demo

The application is deployed on vercel, so you can take a look there:

[https://frontend-take-home-project/](https://frontend-take-home-project.vercel.app/)



## Tests
jest and react testing library are being used for testing purposes

To run the unit tests


```shell
$ npm test
```


## Contributing

Your contributions are always welcome!

1. Clone repo and create a new branch: `$ git checkout -b name_for_new_branch`.
2. Make changes and test
3. Submit Pull Request with comprehensive description of changes


## License

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

The MIT License (MIT) 2023 - Sergio Llanos



