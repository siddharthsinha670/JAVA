//Check if a number is greater than 100.

import java.util.Scanner;

public class greater_number {

    public static void main(String[] args) {
        System.out.println("Enter the number:");
        Scanner x = new Scanner(System.in);
        int num;
        num = x.nextInt();
        if (num >= 100) {
            System.out.println("The number is greater than 100.");
        }
        else
        {
            System.out.println("The number is smaller than 100.");
        }
    }
}
