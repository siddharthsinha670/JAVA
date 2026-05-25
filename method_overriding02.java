class A
{
    public A()
    {
        System.out.println("Constructor of class A");
    }
    public void show()
    {
        System.out.println("Show function of A");
    }
    public void diaplay1()
    {
        System.out.println("Display 1 function of A");
    }
}
class B extends A
{
    public B()
    {
        System.out.println("Constructor of the B");
    }
    public void show()
    {
        System.out.println("Show method of B");
    }
    public void diaplay2()
    {
        System.out.println("Display 2 function of B");
    }
}
class method_overriding02
{
    public static void main(String[] args) {
        A p;
        A a1 = new A();
        B b1 = new B();
        p =a1;
        p.show();
        p = b1;
        p.show();
    }
}