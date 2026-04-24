//Check whether a number is even.

import java.util.Scanner;
public class even_odd
{
    public static void main(String[] args) {
        System.out.println("Enter the number:-");
        Scanner x= new Scanner(System.in);
        int num;
        num= x.nextInt();
        if(num%2==0)
        {
            System.out.println("The number is even.");
        }
        else
        {
            System.out.println("The number is odd number.");
        }
    }
}