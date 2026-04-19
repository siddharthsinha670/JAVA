import java.util.*;
public class number
{
    public static void main(String args[])
    {
        Scanner x = new Scanner(System.in);
        int n;
        System.out.println("input the number");
        n = x.nextInt();
        if(n % 2 == 0)
        {
            System.out.println("Even number");
        }
        else
        {
            System.out.println("Odd number");
        }
        x.close();
    }
}