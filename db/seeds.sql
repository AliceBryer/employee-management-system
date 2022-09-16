
INSERT INTO departments (department_name)
VALUES  ("Management"),
        ("Sales"),
        ("Customer Service"),
        ("Mechanics & Valeters"),
        ("Finance");

INSERT INTO roles (title, salary, department_id)
VALUES  ("General Manager", 50000, 1),
        ("Assistant Manager", 40000, 1),
        ("Showroom sales", 35000, 2),
        ("Phone sales", 30000, 2),
        ("Receptionist", 27500, 3),
        ("Customer relations advisor", 28000, 3),
        ("M.O.T specialist", 35000, 4),
        ("Service specialist", 32000, 4),
        ("Valeter", 26000, 4),
        ("Accountant", 35000, 5),
        ("Assistant Accountant", 27000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ("Bobby", "Monroe", 1, null),
        ("Kim", "Brown", 2, 1),
        ("Hamed", "Ali", 3, null),
        ("Edward", "Jenkins", 4, 3),
        ("Theo", "Ellis", 5, null),
        ("Andy", "Beckett", 6, 5),
        ("Pam", "Dawson", 7, null),
        ("Alice", "Bryer", 8, 7),
        ("Harry", "Jones", 9, 7),
        ("Vincent", "Silva", 10, null),
        ("Dwight", "Wilson", 11, 10);
