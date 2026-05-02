//multiple object of the class
 import java.util. Scanner;
 class complex {
    private int real;
    private int imag;
    public void input()
    {
        Scanner x = new Scanner (System.in);
        System.out.println("Input the real part");
        real = x. nextInt();
        System.out.println("Input the imaginary part:");
        imag =  x.nextInt();
    }
    void show()
    {
        System.out.println("The complex no ="+ real +"+"+ imag+"i");
    }  
}
public class test_3
{
    public static void main(String[] args) {
        complex c1 = new complex();
        c1.input();
        c1.show();

        complex c2 = new complex();
        c2.input();
        c2.show();
    }
}
