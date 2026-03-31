# 🔐 BCRYPT – Final Revision Notes

---

## 1️⃣ What Problem bcrypt Solves

We **don't** store passwords. We store:

```
hash(password)
```

Because hashing is:

- **One-way** — not reversible
- Used for **password verification**, not retrieval

---

## 2️⃣ What Salt Does

**Salt** is a random value that is:

- Generated during **signup**
- **Unique per password**

**Purpose:**

- Same password ≠ same hash
- Prevents **rainbow table attacks**
- Prevents attackers from detecting **password reuse**

**Example:**

| User   | Password  | Salt    | Result  |
| ------ | --------- | ------- | ------- |
| User A | `abbbass` | `salt1` | `hash1` |
| User B | `abbbass` | `salt2` | `hash2` |

> `hash1 ≠ hash2` — even though the password is the same!

---

## 3️⃣ What Cost Factor (Rounds) Means

When you write:

```js
bcrypt.hash(password, 10);
```

`10` is **NOT** 10 loops. It means:

> **2¹⁰ = 1,024** internal transformations

Each `+1` cost **doubles** the work:

| Cost | Transformations |
| ---- | --------------- |
| 10   | 1,024 steps     |
| 11   | 2,048 steps     |
| 12   | 4,096 steps     |

**Purpose:** Make hashing **slow** → slow down brute-force attacks.

---

## 4️⃣ Structure of a Stored Hash

**Example:**

```
$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

**Breakdown:**

| Part                     | Meaning                    |
| ------------------------ | -------------------------- |
| `$2b$`                   | Algorithm version          |
| `$10$`                   | Cost factor                |
| `N9qo8uLOickgx2ZMRZoMye` | Salt (16 bytes → 22 chars) |
| Remaining characters     | Final hash                 |

> 💡 The salt is **embedded inside** the stored hash — no need to store it separately.

---

## 5️⃣ What Happens During Signup

```mermaid
flowchart LR
    A[Plain Password] --> B[Generate Random 16-byte Salt]
    B --> C[Combine Password + Salt]
    C --> D["Run 2^cost Transformations"]
    D --> E[Store Formatted Hash in DB]
```

1. Generate a random **16-byte salt**
2. Combine `password + salt`
3. Run **2^cost** transformations
4. Store the full formatted hash

> ⚠️ Only the **hash** is saved. The plain password is **discarded**.

---

## 6️⃣ What Happens During Login

When the user enters their password:

1. bcrypt **extracts** the `cost` and `salt` from the stored hash
2. Combines the entered password + extracted salt
3. Runs the **same 2^cost** transformations
4. **Compares** the new result with the stored hash

| Result        | Outcome          |
| ------------- | ---------------- |
| Hashes match  | ✅ Login success |
| Hashes differ | ❌ Login fail    |

> 🔑 **No new salt is generated during login.** The original salt (from signup) is reused.

---

## 7️⃣ Deterministic Nature

bcrypt is **deterministic**. Given the same:

- `password`
- `salt`
- `cost`

It will **ALWAYS** produce the **same final hash**.

> There is **no randomness** during the transformation phase.
> Randomness exists **only** during salt generation (at signup).

---

## 8️⃣ Why SHA-256 Alone Is Weak

| Feature         | SHA-256           | bcrypt                  |
| --------------- | ----------------- | ----------------------- |
| Speed           | ⚡ Extremely fast | 🐢 Intentionally slow   |
| GPU-friendly    | ✅ Yes            | ❌ No (harder for GPUs) |
| Adjustable cost | ❌ No             | ✅ Yes                  |
| Built-in salt   | ❌ No             | ✅ Yes                  |

Even with salt, `sha256(password + salt)` is still **too fast** to be secure.

bcrypt wins because it is: **Salted + Slow + Adjustable + GPU-resistant**.

---

## 9️⃣ Why bcrypt Is Future-Proof

If computers become faster → just **increase the cost factor**.

```
Cost 10 → Cost 12 = 4x heavier work
```

> No need to change the algorithm. Just turn up the dial. 🔧

---

## 🔟 Final Mental Model

| Concept     | Role                             |
| ----------- | -------------------------------- |
| **Salt**    | Protects uniqueness              |
| **Cost**    | Protects against speed           |
| **Hash**    | Irreversible mathematical output |
| **Compare** | Re-hash and check equality       |

> bcrypt does **NOT** decrypt. It **re-hashes** and **compares**.

---

## 🧠 Ultimate One-Line Summary

> **bcrypt works because it makes every password _unique_ AND every guess _expensive_.**
