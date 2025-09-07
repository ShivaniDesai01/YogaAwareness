import java.io.*;
import java.time.LocalDate;
import java.util.*;

public class SoulSparkApp {
    static final String FILE = "completions.txt";
    static Scanner sc = new Scanner(System.in);
    static Map<String, List<String>> categories = new LinkedHashMap<>();
    static Map<String, String> completions = new HashMap<>();

    public static void main(String[] args) {
        initData(); loadData();
        System.out.println("Welcome to SoulSpark (Console)");
        while(true) {
            System.out.println("\n1) Browse  2) Daily Session  3) Calendar Summary  4) Exit");
            String choice = sc.nextLine().trim();
            if(choice.equals("1")) browse();
            else if(choice.equals("2")) session();
            else if(choice.equals("3")) summary();
            else if(choice.equals("4")) { saveData(); System.out.println("Goodbye!"); break; }
            else System.out.println("Invalid option.");
        }
    }

    static void initData() {
        categories.put("Morning", Arrays.asList("Sun Salutation", "Tree Pose"));
        categories.put("Stretch", Arrays.asList("Forward Fold", "Seated Twist"));
        categories.put("Relax", Arrays.asList("Child's Pose", "Corpse Pose"));
    }

    static void browse() {
        int i = 1;
        List<String> keys = new ArrayList<>(categories.keySet());
        for(String k : keys) System.out.println((i++) + ") " + k);
        System.out.print("Choose category (or 0 to back): ");
        String ch = sc.nextLine();
        try {
            int idx = Integer.parseInt(ch);
            if(idx == 0) return;
            String key = keys.get(idx - 1);
            System.out.println("-- " + key + " --");
            categories.get(key).forEach(p -> System.out.println(p));
        } catch(Exception e) {
            System.out.println("Invalid choice.");
        }
    }

    static void session() {
        LocalDate today = LocalDate.now();
        List<String> session = new ArrayList<>();
        categories.values().forEach(session::addAll);
        session = session.subList(0, Math.min(5, session.size()));
        Set<Integer> done = new HashSet<>();

        while(true) {
            System.out.println("\nToday's Session (" + today + ")");
            for(int i = 0; i < session.size(); i++) {
                System.out.println((i+1) + ") " + session.get(i) + (done.contains(i) ? " [DONE]" : ""));
            }
            System.out.println("Commands: t<num> (toggle), c (complete), b (back)");
            String cmd = sc.nextLine().trim();
            if(cmd.equals("b")) return;
            if(cmd.equals("c")) {
                int doneCount = done.size();
                String status = doneCount == session.size() ? "complete" : (doneCount > 0 ? "partial" : "none");
                completions.put(today.toString(), status);
                System.out.println("Marked today: " + status);
                saveData(); return;
            }
            if(cmd.startsWith("t")) {
                try {
                    int num = Integer.parseInt(cmd.substring(1)) - 1;
                    if(done.contains(num)) { done.remove(num); System.out.println("Undone"); }
                    else { done.add(num); System.out.println("Done"); }
                } catch(NumberFormatException e) {
                    System.out.println("Invalid toggle.");
                }
            }
        }
    }

    static void summary() {
        System.out.println("\nCalendar Summary:");
        System.out.println("Recorded days: " + completions.size());
        long complete = completions.values().stream().filter(s -> s.equals("complete")).count();
        long partial = completions.values().stream().filter(s -> s.equals("partial")).count();
        System.out.println("Complete: " + complete + ", Partial: " + partial);
        System.out.println("Current streak: " + currentStreak());
        System.out.println("Longest streak: " + longestStreak());
    }

    static void loadData() {
        try(BufferedReader br = new BufferedReader(new FileReader(FILE))) {
            String line;
            while((line = br.readLine()) != null) {
                String[] parts = line.split(",");
                if(parts.length == 2) completions.put(parts[0], parts[1]);
            }
        } catch(IOException ignored) {}
    }

    static void saveData() {
        try(PrintWriter pw = new PrintWriter(new FileWriter(FILE))) {
            completions.forEach((d, s) -> pw.println(d + "," + s));
        } catch(IOException e) {
            System.out.println("Error saving data.");
        }
    }

    static int currentStreak() {
        LocalDate d = LocalDate.now(); int streak = 0;
        while(completions.getOrDefault(d.toString(), "").equals("complete")) {
            streak++; d = d.minusDays(1);
        }
        return streak;
    }

    static int longestStreak() {
        List<String> dates = new ArrayList<>();
        completions.forEach((d, s) -> { if(s.equals("complete")) dates.add(d); });
        Collections.sort(dates);
        int best = 0, current = 0; String last = null;
        for(String d : dates) {
            if(last != null && LocalDate.parse(d).equals(LocalDate.parse(last).plusDays(1))) current++;
            else current = 1;
            best = Math.max(best, current);
            last = d;
        }
        return best;
    }
}

