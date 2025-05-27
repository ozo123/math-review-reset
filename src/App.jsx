import { useState, useEffect } from "react";

const subjects = ["NT", "GT", "NA", "MB", "AP", "POS"];

const flashCards = {
  NT: [
    // Definitions
    { front: "Definition 1.4: Prime Number", back: "An integer n > 1 is said to be a prime number if the only positive integers that divide n are 1 and n itself." },
    { front: "Definition 1.7: Polynomial-time Algorithm", back: "An algorithm with input an integer N > 1 is said to be polynomial-time if there are constants b, c > 0 such that it always completes after c (log N)^b elementary operations." },
    { front: "Definition 1.16: Multiplicative Function", back: "A function f: N → C is multiplicative if for all m, n with gcd(m, n) = 1, we have f(mn) = f(m)f(n). It is totally multiplicative if this holds for all m, n." },
    { front: "Definition 2.1: Quadratic Residue", back: "Let p be an odd prime and a an integer not divisible by p. Then a is a quadratic residue mod p if the congruence x^2 ≡ a (mod p) has a solution." },
    { front: "Definition 3.2: Binary Quadratic Form", back: "A binary quadratic form is a polynomial f(x, y) = ax^2 + bxy + cy^2 with integer coefficients a, b, c." },
    { front: "Definition 3.3: Unimodular Change of Variables", back: "A change of variables (X, Y) = (x, y) A is unimodular if A ∈ SL_2(Z), i.e., det(A) = 1 and entries are integers." },
    { front: "Definition 3.4: Discriminant", back: "For f(x,y)=ax^2+bxy+cy^2 the discriminant is b^2 - 4ac." },
    { front: "Definition 4.9: Dirichlet Series", back: "A Dirichlet series is a formal series ∑_{n=1}^∞ a_n n^{-s}, where {a_n} is a sequence of complex numbers." },
    { front: "Definition 5.2: Continued Fraction Convergents", back: "Given integers a_i with a_i ≥ 1 for i ≥ 1, define p_n, q_n by p_0=a_0, p_1=a_1 a_0+1, p_n=a_n p_{n-1}+p_{n-2}; q_0=1, q_1=a_1, q_n=a_n q_{n-1}+q_{n-2}. Then p_n/q_n is the n-th convergent." },
    // Theorems
    { front: "Theorem 1.6: Fundamental Theorem of Arithmetic", back: "Every integer n > 0 can be written as a product of primes, uniquely up to reordering of factors. Proof: by induction on n, using Euclid's lemma for uniqueness." },
    { front: "Theorem 1.8: Infinitely Many Primes", back: "There are infinitely many prime numbers. Proof: assume finitely many p1,...,pk, consider N = p1...pk+1; any prime factor of N is new." },
    { front: "Theorem 1.11: Euler–Fermat Theorem", back: "If gcd(a,N)=1 then a^{ϕ(N)} ≡ 1 mod N, where ϕ is Euler's totient. Proof: follows from group theory and Lagrange's theorem." },
    { front: "Theorem 1.13: Chinese Remainder Theorem", back: "For pairwise coprime m_i and residues a_i, there is a unique x mod M=m1...mk solving x ≡ a_i mod m_i. Proof: uses explicit construction via inverses." },
    { front: "Theorem 1.14: CRT Isomorphism", back: "Z/MZ ≅ Z/m1Z × ... × Z/mkZ as rings when m_i are coprime. Proof: given by the CRT map." },
    { front: "Theorem 1.20: Lagrange's Theorem (Polynomials)", back: "Over Z/pZ, a polynomial of degree n has at most n roots. Proof: factor X^j - a_j and induction." },
    { front: "Theorem 1.21: (Z/pZ)^× is Cyclic", back: "For prime p, the multiplicative group mod p is cyclic. Proof: applies Lagrange and counting argument." },
    { front: "Theorem 1.23: (Z/p^kZ)^× is Cyclic", back: "For odd prime p, (Z/p^kZ)^× is cyclic. Proof: uses lifting of primitive roots." },
    { front: "Theorem 2.7: Quadratic Reciprocity", back: "(p/q)(q/p) = (-1)^{(p-1)(q-1)/4}. Proof: Gauss's lemma and counting lattice points." },
    { front: "Theorem 3.1: Fermat–Euler Theorem", back: "An odd prime p is a sum of two squares iff p ≡ 1 mod 4. Proof: representability by x^2+y^2 and properties of Gaussian integers." },
    { front: "Theorem 4.1: Prime Number Theorem", back: "π(X) ~ X / log X as X → ∞. Proof: analytic, via ζ(s) non-vanishing on Re(s)=1 line." },
    { front: "Theorem 4.2: Dirichlet's Theorem", back: "Infinitely many primes in arithmetic progression a mod N when gcd(a,N)=1. Proof: Dirichlet L-series." },
    { front: "Theorem 5.5: Best Approximation by Convergents", back: "Convergents p_n/q_n of continued fractions give best approximations: any q<q_{n+1} yields |qθ-p|≥|q_n θ - p_n|." },
    { front: "Theorem 5.6: Convergent Characterization", back: "p/q is a convergent if and only if |θ - p/q|<1/(2q^2). Proof: uses Lagrange's approximation theorem." },
    { front: "Theorem 5.8: Lagrange's Theorem", back: "An irrational θ has an ultimately periodic continued fraction expansion iff θ is a quadratic irrational." },
    { front: "Theorem 5.9: Galois's Theorem", back: "Describes pure periodicity of quadratic irrationals: θ=[a0,...,a_{n-1},a_n] implies -1/θ'=[a_n,...,a0]." },
    { front: "Theorem 5.10: Pell's Equation", back: "For non-square d>1, x^2 - d y^2 = 1 has integer solutions. Proof: uses convergents of √d." }
  ],
  GT: flashCards.GT,
  NA: flashCards.NA,
  MB: flashCards.MB,
  AP: flashCards.AP,
  POS: flashCards.POS
};

// rest of App.jsx unchanged

export default function App() { /* ... */ }
