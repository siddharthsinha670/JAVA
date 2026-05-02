//define the complex class and implement constructor
import java.util.Scanner;
class complex{
    private int real;
    private int imag;
    public complex()
    {
        real =1;
        imag = 1;
    }
    public complex(int x)
    {
        real = x;
        imag = 1;
    }
    public complex(int x ,int y)
    {
        real = x;
        imag = y;
    }
    public complex (complex x)
    {
        real = x.real;
        imag = x.imag;
    }
    public void diaplay()
    {
        Scanner x = new Scanner (System.in);
        System .out.println("input the real part:");
        real = x.nextInt();
        System.out.println("Imput the imaganay part:");
        imag = x.nextInt();
    }
    public void show()
    {
        System.out.println("The complex no ="+ real +"+"+ imag+"i");
    }
}
public class test_4
{
    public static void main(String[] args) {
        complex c1 = new complex(2,3);
        c1.show();
        complex c2 = new complex();
        c2.show();
        complex c3 = new complex(7);
        c3.show();
        complex c4 = new complex(c1);
        c3.show();
    }
}