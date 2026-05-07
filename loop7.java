//Even number print karo 

import java.util.Scanner;

public class loop7 {

    public static void main(String[] args) 
    {
        Scanner y = new Scanner(System.in);
        int x;
        for(x=1 ; x<=20 ;x++)
        {
            if(x%2==0)
            {
                System.out.println("The even no between 1 to 20 is: "+x);
            }
        }

    }
}
