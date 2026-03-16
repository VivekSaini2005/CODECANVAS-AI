-- Blind 75 mapping
INSERT INTO public."SheetProblem" (id, "sheetId", "problemId", "order")
SELECT uuidv4(), s.id, p.id, row_number() OVER()
FROM sheets s, problems p
WHERE s.name='Blind 75'
AND p.slug IN (
'two-sum','best-time-to-buy-and-sell-stock','contains-duplicate',
'product-of-array-except-self','maximum-subarray','maximum-product-subarray',
'find-minimum-rotated-array','search-rotated-array','three-sum',
'container-with-most-water','climbing-stairs','coin-change',
'longest-increasing-subsequence','longest-common-subsequence',
'word-break','combination-sum','house-robber','house-robber-ii',
'decode-ways','unique-paths'
);

-- Striver SDE mapping
INSERT INTO public."SheetProblem" (id, "sheetId", "problemId", "order")
SELECT uuidv4(), s.id, p.id, row_number() OVER()
FROM sheets s, problems p
WHERE s.name='Striver SDE Sheet'
AND p.slug IN (
'set-matrix-zeroes','pascals-triangle','next-permutation',
'kadane-algorithm','merge-intervals','rotate-matrix','search-2d-matrix',
'pow-x-n','majority-element','majority-element-ii',
'reverse-linked-list','middle-of-linked-list','linked-list-cycle',
'remove-nth-node','add-two-numbers','intersection-linked-lists',
'flatten-binary-tree','binary-tree-inorder','max-depth-binary-tree','same-tree'
);

-- NeetCode 150 (reuse mix of popular)
INSERT INTO public."SheetProblem" (id, "sheetId", "problemId", "order")
SELECT uuidv4(), s.id, p.id, row_number() OVER()
FROM sheets s, problems p
WHERE s.name='NeetCode 150'
LIMIT 20;