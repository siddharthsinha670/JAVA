class A
{
    public A()
    {
        System.out.println("Constructor of A");
    }
    public void show1()
    {
        System.out.println("Show 1 method of A");
    }
    public void show2()
    {
        System.out.println("Show 2 method of A");
    }
}
class B extends A
{
    public B()
    {
        System.out.println("Constructor of B");
    }
    public void show3()
    {
        System.out.println("Show 3 method of B");
    }
    public void show4()
    {
        System.out.println("Show 4 method of B");
    }
}
public class inheritance
{
    public static void main(String args[])
    {
        B b1 = new  B();
        b1.show3();
        b1.show2();
        b1.show2();

    }
}