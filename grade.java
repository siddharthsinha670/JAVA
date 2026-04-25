import java.util.Scanner;
public class grade
{
    public static void main(String[] args) {
        System.out.println("Enter the marks:-");
        Scanner x = new Scanner(System.in);
        int marks;
        marks = x.nextInt();
        {
            if(marks>=90)
            {
                System.out.println("Grade A");
            }
            else if(marks >=75)
            {
                System.out.println("Grade B");
            }
            else if(marks >= 50)
            {
                System.out.println("Pass");
            }
            else{
                System.out.println("Fail");
            }
            
        }
    }
}