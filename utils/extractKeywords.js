import natural from 'natural';

const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;
const stopWords = new Set(natural.stopwords);

export const extractKeywords = (query) => {
    // Tokenize the query
    const tokens = tokenizer.tokenize(query);

    // Normalize tokens to lowercase and filter out stop words
    const filteredTokens = tokens.map(token => token.toLowerCase()).filter(token => !stopWords.has(token));

    console.log("Filtered Tokens:", filteredTokens);

    // Create a new TfIdf instance for each query
    const tfidf = new TfIdf();
    tfidf.addDocument(filteredTokens.join(' '));

    // Extract keywords based on their TfIdf scores
    const keywords = [];
    tfidf.listTerms(0).forEach(item => {
        console.log(`Term: ${item.term}, TfIdf: ${item.tfidf}`);
        if (filteredTokens.includes(item.term)) {
            keywords.push(item.term);
        }
    });

    console.log("Extracted Keywords:", keywords);

    return keywords;
};