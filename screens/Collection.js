import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image, StatusBar, AsyncStorage } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import BookHolder from '../components/BookHolder';

class Collection extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: () => <Text style={{paddingHorizontal: 15, color: 'grey'}}>{navigation.getParam('bookCount')} book(s)</Text>,
            headerLeft: () => {
                return (
                    <View style={{flexDirection: 'row', marginLeft: 10}}>
                        <Image style={{width: 18, height: 18}} source={{uri: 'https://www.shareicon.net/data/2016/09/23/833823_list_512x512.png'}}/>
                        <Text style={{fontSize: 12, fontWeight: 'bold', color: '#FF7C44', marginLeft: 5}}>{navigation.getParam('pageCount')}</Text>
                    </View>
                )
            }
        }
    }
    componentDidMount() {
        this.fetchCollection();
        this.props.navigation.setParams({
            bookCount: 0
        });
    }
    state = {
        searchKeys: '',
        books: [],
        collection: []
    }
    updateSearch = keys => {
        this.setState({searchKeys:keys});
        const collection = this.state.collection;
        var filteredBooks = [];
        if (keys == '') {
            this.setState({books:collection});
        } else {
            filteredBooks = collection.filter(book => book.title.includes(keys));
            this.setState({books:filteredBooks});
        }
    }
    componentWillReceiveProps(nextProps) {
        var updatedCollection = nextProps.collection[Object.keys(this.props.collection)[0]];
        if (this.props.collection != nextProps.collection) {
            var pageCount = 0;
            this.setState({books:updatedCollection, collection:updatedCollection});
            for (let book of updatedCollection) {
                if (book.pageCount) {
                    pageCount = pageCount + book.pageCount;
                } else {
                    pageCount = pageCount + 100;
                }
            }

            this.props.navigation.setParams({
                bookCount: updatedCollection.length,
                pageCount
            });
        }  
    }
    fetchCollection = async () => {
        try {
            let collection = await AsyncStorage.getItem('collection');
            if (collection !== null || collection !== '[]') {
                collection = JSON.parse(collection);
                this.props.updateCollection(collection);
                this.setState({books:this.props.collection[Object.keys(this.props.collection)[0]]});
                this.props.navigation.setParams({
                    bookCount: this.state.books.length
                });
            } 
        } catch (e) {
            console.log(e);
        }
    }
    removeBook = book => {
        var books = this.state.books;
        const index = books.indexOf(book);
        books.splice(index, 1);

        this.updateCollection(books);
        this.props.updateCollection(books);
        this.props.navigation.setParams({
            bookCount: books.length
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <View>
                    <StatusBar translucent {...this.props} barStyle="dark-content" />
                </View>
                <SearchBar 
                    placeholder="Search collection"
                    onChangeText={this.updateSearch}
                    value={this.state.searchKeys}
                />
                {
                    this.state.collection.length < 1 ? 
                    <Text style={{textAlign: 'center', fontSize: 22, fontWeight: 'bold', padding: 30, marginTop: 200, color: '#FF7C44'}}>Empty collection, start by adding some books!</Text> 
                    : 
                    <Text style={{display: 'none'}}></Text>
                }
                <FlatList
                    data={this.state.books}
                    style={{flex: 1}}
                    keyExtractor={item => item.title}
                    renderItem={book => {
                        return (
                            <BookHolder
                                thumbnail={book.item.imageLinks.thumbnail}
                                title={book.item.title}
                                subtitle={book.item.subtitle}
                                authors={book.item.authors}
                                pageCount={book.item.pageCount}
                                removeBook={() => this.removeBook(book.item)}
                            />
                        )
                    }}
                />
                <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.navigation.navigate('AddBook')} style={styles.corner}>
                    <Image style={{width: 80, height: 80}} source={{uri: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678092-sign-add-512.png'}}/>
                </TouchableOpacity>
            </View>
        );
    }
    updateCollection(updatedCollection) {
        AsyncStorage.setItem('collection', JSON.stringify(updatedCollection));
        alert('Removed from collection!');
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    corner: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        marginVertical: 30,
        marginHorizontal: 20
    }
});

function mapStateToProps(state) {
    return { collection: state.collection }
}

const mapDispatchToProps = dispatch => {
    return {
        // dispatching plain actions
        updateCollection: updatedCollection => dispatch({ type: 'UPDATE_COLLECTION', updatedCollection })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Collection);