 class A2
 {
    A2()
    {
        System.out.println("hello  Viewer");
    }
 }
 class B2 extends A2
 {
    B()
    {
        System.out.println("hello learner");
    }
 }
 class Super
 {
    public static void main(String args[])
    {
        B2 r = new B();
    }
 }