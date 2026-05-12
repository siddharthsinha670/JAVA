import java.util.Scanner;
class complex
{
    private int real;
    private int imag;
    public void input()
    {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter the real part of the complex no:");
        real = sc.nextInt();
        System.out.println("Enter the imaginary part of the complexx no:");
        imag = sc.nextInt();
    }
    public void show()
    {
        System.out.println("The complex no is " + real + " + " + imag + "i");
    }
}
public class test7
{
    public static void main(String args[])
    {
        complex c1 = new complex();
        c1.input();
         c1.show();

    }
}