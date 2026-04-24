//Take age as input and check if a person is eligible to vote (>=18)

import java.util.Scanner;

public class voting_age {

    public static void main(String[] args) {
       
        System.out.println("Enter your age:-.........");
        Scanner obj = new Scanner(System.in);
        int age;
        age = obj.nextInt();
        if (age >= 18) {
            System.out.println("You are eligible for voting");
        }
    }
}
