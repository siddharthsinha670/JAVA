//Print multiplication table of a number (user input)

import java.util.Scanner;
public class multiplication_table
{
    public static void main(String[] args) {
        System.out.println("Enter the Number:");
        Scanner x = new Scanner(System.in);
        int i;
        i = x.nextInt();
        for(i=1 ; i<=100 ; i++)
        {
          if(i%3==0)
          {
             System.out.println(i);
          }
        } 
    }
}