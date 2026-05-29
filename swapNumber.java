// Swap Two Numbers Without Third Variable
import java.util.Scanner;
class swapNumber
{
    public static void main(String args[])
    {
     Scanner sc = new Scanner(System.in);
            int a,b;

            System.out.println("Enter the first number:");
            a= sc.nextInt();

            System.out.println("Enter the second Number:");
            b = sc.nextInt();

            System.out.println("\nBefore Swapping:");
            System.out.println("a="+a);
            System.out.println("b="+b);

            a=a+b;
            b=a-b;
            a=a-b;

            System.out.println("\nAfter Swapping");
            System.out.println("a="+a);
            System.out.println("b="+b);

    }
}