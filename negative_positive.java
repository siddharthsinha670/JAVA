//Write a program to check if a number is positive.

import java.util.Scanner;
public class negative_positive
{
    public static void main(String[] args) {
        System.out.println("Enter the number:-");
        Scanner x= new Scanner(System.in);
        int num;
        num= x.nextInt();
        if(num>=0)
        {
            System.out.println("The number is positive");
        }
        else{
            System.out.println("The number is negative");
        }
    }
}