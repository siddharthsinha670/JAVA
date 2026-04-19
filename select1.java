import java.util.*;
public class select1
{
    public static void main(String args[])
    {
        Scanner x = new Scanner(System.in);
        int s;
        System.out.println("input the number");
        s=x.nextInt();
        if(s % 2==0)
        {
            System.out.println("Even Number");
        }
        x.close();
    }
}
