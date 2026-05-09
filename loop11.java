
import java.util.Scanner;

public class loop11 {
    public static void main(String args[])
    {
        System.out.println("Find the factorial of the given number:-");
        
        Scanner x = new Scanner(System.in);
        int fact=1;
         int n = x.nextInt();
        for(int a=1;a<=n;a++)
        {
            fact = fact*a;
        }
        System.out.println("The factorial of the griven number is :"+fact);
    }
    
}