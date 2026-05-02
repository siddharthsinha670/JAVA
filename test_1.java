import java.util.Scanner;
class complex { // yaha pe public ka use nahi krna hai
    int real;
    int imag;
    void input()
    {
        Scanner x = new Scanner(System.in);
        System.out.println("Input the real part");
        real= x.nextInt();
        System.out.println("input the imaginary part:");
        imag = x.nextInt();
    }
    void show()
    {
        System.out.println("The complex no="+ real +"+"+ imag+"i");
    }
}
public class test_1
{
    public static void main(String args[]) // main hai aur uper me hamlog public ka use nahi knrge 
    {
        complex c1 = new complex();
        c1.input();
        c1.show();
    }
}
