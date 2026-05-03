import java.util.Scanner;
public class loop4
{
    public static void main(String args [])
    {
        Scanner x = new Scanner(System.in);
        int sum = 0;
        for (int i = 0; i <= 100; i++)
        {
            sum = sum+i;
            System.out.println("sum ="+sum);
        }
    }
}