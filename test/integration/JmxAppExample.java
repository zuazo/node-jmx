
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.io.IOException;

import javax.management.*;
import java.lang.management.ManagementFactory;

public class JmxAppExample implements JmxAppExampleMBean {

    public JmxAppExample() {
    }

    /* MBean interface */

    private String stringMethod = "LongObject";

    /* attributes */
    public synchronized String getStringAttr() {
        return stringMethod;
    }

    public synchronized void setStringAttr(String str) {
        stringMethod = str;
    }
    public synchronized long getLongAttr() {
        long l = 5;
        return l;
    }
    public synchronized java.lang.Long getLongObjAttr() {
        return new Long(27);
    }

    /* operations */
    public synchronized void callVoidMethod() {
    }

    public synchronized void callVoidWithSimpleArgs(String str, long num) {
    }

    public synchronized long callLongWithSimpleArgs() {
        return 2;
    }

    public synchronized long callLongObjWithSimpleArgs() {
        return new Long(7);
    }

    public synchronized void callVoidWithMixedArguments(long num1, int num2, Long num3) {
    }

    /* MBean registering logic */

    private static String jmxDomain = "com.onddo.test";
    private static String mbeanName = "JmxAppExample";
    private static MBeanServer mbs = null;

    private static String getMBeanPath(String beanName) {
        return jmxDomain + ":type=" + beanName;
    }

    private static void registerMBean() {
        if (mbs == null) {
            mbs = ManagementFactory.getPlatformMBeanServer();
        }
        ObjectName objectName = null;
        JmxAppExample beanObject = new JmxAppExample();
        try {
            objectName = new ObjectName(getMBeanPath(mbeanName));
            mbs.registerMBean(beanObject, objectName);
            System.out.println("MBean registered successfully.");
        } catch (MalformedObjectNameException e) {
            e.printStackTrace();
            System.out.println("Error: cannot register MBean.");
        } catch (NotCompliantMBeanException e) {
            System.out.println("Error: cannot register MBean.");
            e.printStackTrace();
        } catch (InstanceAlreadyExistsException e) {
            System.out.println("Error: cannot register MBean.");
            e.printStackTrace();
        } catch (MBeanRegistrationException e) {
            System.out.println("Error: cannot register MBean.");
            e.printStackTrace();
        }
    }

    private static void deregisterMBean() {
        try {
            ObjectName objectName = new ObjectName(getMBeanPath(mbeanName));
            mbs.unregisterMBean(objectName);
            System.out.println("MBean deregistered successfully.");
        } catch (MalformedObjectNameException e) {
            System.out.println("Error: cannot deregister MBean.");
            e.printStackTrace();
        } catch (InstanceNotFoundException e) {
            System.out.println("Error: cannot deregister MBean.");
            e.printStackTrace();
        } catch (MBeanRegistrationException e) {
            System.out.println("Error: cannot deregister MBean.");
            e.printStackTrace();
        }
    }

    /* Main */

    public static void main(String[] args) {
        boolean exit = false;
        String readLine;
        InputStreamReader inputStream = new InputStreamReader(System.in);
        BufferedReader stdin = new BufferedReader(inputStream);
        registerMBean();
        System.out.print("> ");
        while (!exit) {
            try {
                readLine = stdin.readLine();
            } catch(IOException e) {
                e.printStackTrace();
                continue;
            }
            if (readLine.equals("exit")) {
                exit = true;
            } else {
                System.err.println("Unknown comand: " + readLine);
                System.out.print("> ");
            }
        }
        deregisterMBean();
    }

}

