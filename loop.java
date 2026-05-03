//Print numbers from 1 to 10 increasing order

import java.util.Scanner;
public class loop
{
    public static void main(String args[])
    {
        Scanner x= new Scanner(System.in);
        int a;
        for(a=1;a<=10;a++)
        {
            System.out.println("The number is: " + a);
        }
        x.close();
    }
}