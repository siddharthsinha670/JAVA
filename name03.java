//1.	User se naam input lo aur print karo.

import java.util.Scanner;

public class name03 {
    public static void main(String args[]) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter the name :");
        String name = sc.nextLine();
        if (name.matches(".*\\d.*")) {
            System.out.println("you can not use number (only character)");
        } else {
            System.out.println("The name of the user is: " + name);
        }
    }
}