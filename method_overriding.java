class A
{
    public A()
    {
        System.out.println("consrturctor of class A");
    } 
    public void show()
    {
        System.out.println("Show function of class A");
    }
    public void display1()
    {
        System.out.println("Display 1 function of A");
    }
}
class B extends A 
{
    public B()
     {
        System.out.println("Constructor of class B");
    }
    public void show()
    {
        System.out.println("Show method of B");        
    }
    public void display2()
    {
        System.out.println("Display 2 function of B");
    }
}
class method_overriding
{
    public static void main(String args[])
    {
        B b1 = new B();
        b1.display2();
        b1.display1();
        b1.show();
    }
}