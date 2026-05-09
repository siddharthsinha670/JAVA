import java.util.Scanner;
public class factorial
{
    public static void main(String[] args) 
    {
         System.out.println("Enter the number:");
         Scanner sc = new Scanner(System.in);
        int fact =1;
        int n = sc.nextInt();
        for(int i=1;i<=n;i++)
        {
            fact = fact*i;
        }
        System.out.println("The factorial of the given number is : "+fact);
    }
}