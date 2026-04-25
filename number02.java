//Check if a number is a three-digit number.

import java.util.Scanner;
public class number02
{
    public static void main(String [] args)
    {
        System.out.println("Enter the number :");
        Scanner x = new Scanner( System.in);
        int num;
        num = x . nextInt();
        if(num >= 100 && num <= 999)
        {
            System.out.println("The number is three digit");
        }
        else 
        {
            System.out.println("The number dont have three digit.");
        }
    }
}