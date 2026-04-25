//print  even number form 1 to 20

import java.util.Scanner;
public class print_even
{
    public static void main(String[] args) {
        Scanner x= new Scanner(System.in);
        int i; 
        for(i=1 ; i<=20 ; i++)
        {
            if(i % 2 == 0)
            {
                System.out.println(i);
            }
        
            
        }
    }

}