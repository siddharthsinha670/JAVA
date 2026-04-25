import java.util.Scanner;
public class salary_bonus {
    public static void main(String[] args) {
        System.out.println("Enter the Salary:=");
        Scanner x= new Scanner(System.in);
        int Salary;
        Salary = x.nextInt();
        if(Salary>=50000)
        {
            System.out.println("apply 10% discount");
        }
        else 
        {
            System.out.println("apply 5% discount");
        }
    }
    
}
