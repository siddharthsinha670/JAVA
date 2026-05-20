/*Student Details

Create overloaded constructors in class Student:

No argument
Name only
Name and age
Name, age, and course

Display student details.*/

class student
{
    public student()
    {
        //constructor
    }
    public void stu()
    {
        System.out.println("default");
    }
    public void stu(String name)
    {
        System.out.println("Enter the name of the student: ");
    }
    public void stu()
    {
        System.out.println();
    }
}