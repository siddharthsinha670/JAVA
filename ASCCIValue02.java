//Find interger ascii value.
import java.util.Scanner;
class ASCCIValue02
{
   public static void main(String args[])
   {
      Scanner sc = new Scanner(System.in);
      int a = sc.nextInt();
      char ch = (char)a;
      System.out.println("character ="+ch);
   }
}