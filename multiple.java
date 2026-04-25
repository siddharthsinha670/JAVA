//Check if a number is a multiple of 7.

import java.util.Scanner;
public class multiple
{
    public static void main(String [] args)
    {
        System.out.println("Enter the number");
        Scanner x= new Scanner(System.in);
        int num;
        num = x.nextInt();
        if(num%7==0)
        {
            System.out.println("The number is divisible by 7");
        }

    }

}