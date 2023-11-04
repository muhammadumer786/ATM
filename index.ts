#! /usr/bin/env node
import inquirer from 'inquirer'
import { faker } from '@faker-js/faker'
import chalk from 'chalk'


console.log(chalk.blue(`enter user pin between 100 to 109`));

interface userInterface  {
    userId: number,
    userPin: number,
    userName: string,
    userEmail: string,
    userAccountNumber: number,
    userBalance: number
}

let createUsers = () => {
    let generateUsers: userInterface[] = []

    for (let i = 0; i < 10; i++) {
        let addUser: userInterface = {
            userId: i,
            userPin: 100 + i,
            userName: faker.person.fullName(),
            userEmail: faker.internet.email(),
            userAccountNumber: Math.floor(Math.random() * 690),
            userBalance: 2500000
        }
        generateUsers.push(addUser);
    }
    return generateUsers;
}


let atmMachine = async (generateUsers: userInterface[]) => {
    let atmResponse = await inquirer.prompt({
        type: "number",
        message: "plese enter pin code :",
        name: "pin"
    })

    let atmUsers = generateUsers.find(val => val.userPin == atmResponse.pin)

    if (atmUsers) {
        console.log(chalk.yellow(`Welcome ${atmUsers.userName}`));
        atmFunc(atmUsers)
        return
    }
    console.log(chalk.red("Invalid user pin"));
};


// console.log(createUsers());
// atmMachine(createUsers());


let atmFunc = async (atmUsers: userInterface) => {

    let ans = await inquirer.prompt({
        type: "list",
        name: "select",
        message: chalk.green("select your operation to perform by atm machine:"),
        choices: ["withdraw", "balance", "deposit", "exit"]
    })
    console.log(ans);

    if (ans.select == "withdraw") {
        let amount = await inquirer.prompt({
            type: "number",
            message: "enter amount to withdraw:",
            name: "rupee"
        })

        if (amount.rupee > atmUsers.userBalance) {
            return console.log(chalk.yellow("your balance is less than you enter amount."));
        } else if (amount.rupee > 40000) {
            return console.log(chalk.yellow(`you are not allowed to withdraw larger than 40000 amount at once.`));
        }
        console.log(chalk.yellow(`withdraw amount: ${amount.rupee}`));
        console.log(chalk.yellow(`balance remaining: ${atmUsers.userBalance - amount.rupee}`));
    }
    else if (ans.select == "balance") {
        console.log(chalk.yellow(`you remaining balance is : ${atmUsers.userBalance}`));
        return
    }
    else if (ans.select == "deposit") {
        let deposit = await inquirer.prompt({
            type: "number",
            message: chalk.green("deposit amount enter: "),
            name: "rupee"
        })
        console.log(chalk.yellow(`previous balance is: ${atmUsers.userBalance}\n`));
        console.log(chalk.yellow(`your deposit amount: ${deposit.rupee}\n`));
        console.log(chalk.yellow(`your new total balance is :${atmUsers.userBalance + deposit.rupee}\n`));
    }

    else if (ans.select == "exit") {
        console.log(chalk.yellow(`thank you for using atm.`));
        return
    }

}


atmMachine(createUsers());

