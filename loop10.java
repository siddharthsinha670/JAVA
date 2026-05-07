import java.util.Scanner;
public class loop10 {
    public static void main()
    {
        Scanner sc = new Scanner(System.in);
        int sum=0;
        int n = sc.nextInt();
        for(int a=1; a<=n ; a++)
        {
            sum=sum+a;
            System.out.println(sum);
        }
        
    }
    
}
